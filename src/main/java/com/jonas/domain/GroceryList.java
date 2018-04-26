package com.jonas.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A GroceryList.
 */
@Entity
@Table(name = "grocery_list")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class GroceryList implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "list_name")
    private Integer listName;

    @Column(name = "item_name")
    private String itemName;

    @ManyToOne
    private User listOwner;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getListName() {
        return listName;
    }

    public GroceryList listName(Integer listName) {
        this.listName = listName;
        return this;
    }

    public void setListName(Integer listName) {
        this.listName = listName;
    }

    public String getItemName() {
        return itemName;
    }

    public GroceryList itemName(String itemName) {
        this.itemName = itemName;
        return this;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public User getListOwner() {
        return listOwner;
    }

    public GroceryList listOwner(User user) {
        this.listOwner = user;
        return this;
    }

    public void setListOwner(User user) {
        this.listOwner = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        GroceryList groceryList = (GroceryList) o;
        if (groceryList.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), groceryList.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "GroceryList{" +
            "id=" + getId() +
            ", listName=" + getListName() +
            ", itemName='" + getItemName() + "'" +
            "}";
    }
}
